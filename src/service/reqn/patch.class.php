<?php
/**
 * patch.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\reqn;
use cenozo\lib, cenozo\log, magnolia\util;

class patch extends \cenozo\service\patch
{
  /**
   * Extend parent method
   */
  public function get_file_as_array()
  {
    $patch_array = parent::get_file_as_array();

    // convert column "language" to language_id
    if( array_key_exists( 'language', $patch_array ) )
    {
      $language_class_name = lib::get_class_name( 'database\language' );
      $patch_array['language_id'] =
        $language_class_name::get_unique_record( 'code', $patch_array['language'] )->id;
      unset( $patch_array['language'] );
    }

    return $patch_array;
  }

  /**
   * Extend parent method
   */
  public function validate()
  {
    parent::validate();

    $action = $this->get_argument( 'action', false );
    if( $action )
    {
      // define whether the action is allowed
      $db_role = lib::create( 'business\session' )->get_role();
      $applicant = 'applicant' == $db_role->name;
      $administrator = 'administrator' == $db_role->name;
      $db_reqn = $this->get_leaf_record();
      $db_last_stage_type = $db_reqn->get_last_stage_type();
      $state = $db_reqn->state;
      $phase = $db_last_stage_type->phase;
      $code = NULL;
      if( 'abandon' == $action )
      {
        if( ( !$applicant && !$administrator ) || 'deferred' != $state ) $code = 403;
      }
      else if( 'defer' == $action )
      {
        if( 'review' != $phase && 'agreement' != $phase ) $code = 403;
      }
      else if( 'reactivate' == $action )
      {
        if( !$administrator || ( 'abandoned' != $state && 'rejected' != $state ) ) $code = 403;
      }
      else if( 'prepare' == $action )
      {
        if( !$administrator || !is_null( $state ) ) $code = 403;
      }
      else if( 'reject' == $action )
      {
        if( !$administrator || ( 'review' != $phase && 'deferred' != $state ) ) $code = 403;
      }
      else if( 'submit' == $action )
      {
        if( $applicant )
        {
          if( 'new' != $phase && 'deferred' != $state ) $code = 403;
          else
          {
            // check to make sure the start date is appropriate
            $delay = lib::create( 'business\setting_manager' )->get_setting( 'general', 'start_date_delay' );
            $db_reqn->save(); // this will make sure the deadline is appropriate
            $deadline = util::get_datetime_object( $db_reqn->get_deadline()->date );
            $deadline->add( new \DateInterval( sprintf( 'P%dM', $delay ) ) );
            if( $db_reqn->start_date < $deadline ) $code = 409;
          }
        }
        else $code = 403;
      }
      else if( 'next_stage' == $action )
      {
        if( $administrator )
        {
          if( !is_null( $state ) || (
            ( 'review' != $phase || 'SMT Review' == $db_last_stage_type->name ) &&
            ( 'agreement' != $phase || 'Report Required' == $db_last_stage_type->name )
          ) ) $code = 403;
        }
        else $code = 403;
      }
      else if( 'decide' == $action )
      {
        if( !$administrator || 'SMT Review' != $db_last_stage_type->name ) $code = 403;
        else
        {
          $approve = $this->get_argument( 'approve' );
          if( !in_array( $approve, array( 'yes', 'conditional', 'no' ) ) )
          {
            $this->set_data( 'Invalid approve type.' );
            $code = 400;
          }
        }
      }
      else
      {
        $this->set_data( 'Invalid action type.' );
        $code = 400;
      }

      if( !is_null( $code ) ) $this->status->set_code( $code );
    }
  }

  /**
   * Extend parent method
   */
  public function execute()
  {
    parent::execute();

    $notification_type_class_name = lib::get_class_name( 'database\notification_type' );

    $headers = apache_request_headers();
    if( false !== strpos( $headers['Content-Type'], 'application/octet-stream' ) )
    {
      $filename = sprintf( '%s/%s', ETHICS_LETTER_PATH, $this->get_leaf_record()->id );
      if( false === file_put_contents( $filename, $this->get_file_as_raw() ) )
        throw lib::create( 'exception\runtime',
          sprintf( 'Unable to write file "%s"', $filename ),
          __METHOD__ );
    }

    $action = $this->get_argument( 'action', false );
    if( $action )
    {
      $db_reqn = $this->get_leaf_record();
      if( 'abandon' == $action )
      {
        $db_reqn->state = 'abandoned';
        $db_reqn->save();
      }
      else if( 'defer' == $action )
      {
        $db_reqn->state = 'deferred';
        $db_reqn->save();

        // send a notification
        $db_notification = lib::create( 'database\notification' );
        $db_notification->reqn_id = $db_reqn->id;
        $db_notification->notification_type_id =
          $notification_type_class_name::get_unique_record( 'name', 'Action required' )->id;
        $db_notification->email = $db_reqn->email;
        $db_notification->datetime = util::get_datetime_object();
        $db_notification->save();
      }
      else if( 'reactivate' == $action )
      {
        $db_reqn->state = NULL;
        $db_reqn->save();
      }
      else if( 'prepare' == $action )
      {
        $db_last_stage = $db_reqn->get_last_stage();
        $db_last_stage->unprepared = false;
        $db_last_stage->save();
      }
      else if( 'reject' == $action )
      {
        $db_reqn->state = 'rejected';
        $db_reqn->save();

        // send a notification
        $db_notification = lib::create( 'database\notification' );
        $db_notification->reqn_id = $db_reqn->id;
        $db_notification->notification_type_id =
          $notification_type_class_name::get_unique_record( 'name', 'Rejection' )->id;
        $db_notification->email = $db_reqn->email;
        $db_notification->datetime = util::get_datetime_object();
        $db_notification->save();
      }
      else if( 'submit' == $action )
      {
        if( 'deferred' == $db_reqn->state )
        {
          $db_reqn->state = NULL;
          $db_reqn->save();
        }
        else
        {
          // this will submit the reqn for the first time
          $db_reqn->add_to_stage();
        }
      }
      else if( 'next_stage' == $action )
      {
        // add the reqn to whatever the next stage is
        $db_reqn->add_to_stage();
      }
      else if( 'decide' == $action )
      {
        $approve = $this->get_argument( 'approve' );
        $stage_type = NULL;
        if( 'yes' == $approve ) $stage_type = 'Approved';
        else if( 'conditional' == $approve ) $stage_type = 'Conditionally Approved';
        else if( 'no' == $approve ) $stage_type = 'Not Approved';
        $db_reqn->add_to_stage( $stage_type );

        // send a notification
        $db_notification = lib::create( 'database\notification' );
        $db_notification->reqn_id = $db_reqn->id;
        $db_notification->notification_type_id =
          $notification_type_class_name::get_unique_record( 'name', 'Notice of decision' )->id;
        $db_notification->email = $db_reqn->email;
        $db_notification->datetime = util::get_datetime_object();
        $db_notification->save();
      }
      else
      {
        log::warning( sprintf(
          'Received PATCH:reqn/%d with unknown action "%s"',
          $db_reqn->id,
          $action
        ) );
      }
    }
  }
}

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
      $db_reqn = $this->get_leaf_record();
      $db_current_stage_type = $db_reqn->get_current_stage_type();
      $state = $db_reqn->state;
      $phase = $db_current_stage_type->phase;
      $code = NULL;
      if( 'abandon' == $action )
      {
        if( !in_array( $db_role->name, array( 'applicant', 'administrator' ) ) || 'deferred' != $state ) $code = 403;
      }
      else if( 'defer' == $action )
      {
        if( 'review' != $phase && 'agreement' != $phase ) $code = 403;
      }
      else if( 'reactivate' == $action )
      {
        if( 'administrator' != $db_role->name || 'abandoned' != $state ) $code = 403;
      }
      else if( 'submit' == $action )
      {
        if( 'applicant' == $db_role->name )
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
        if( in_array( $db_role->name, array( 'administrator', 'chair' ) ) )
        {
          if( !is_null( $state ) || (
            ( 'review' != $phase || 'SMT Decision' == $db_current_stage_type->name ) &&
            ( 'agreement' != $phase || 'Report Required' == $db_current_stage_type->name )
          ) ) $code = 403;
        }
        else $code = 403;
      }
      else if( 'decide' == $action )
      {
        if( !in_array( $db_role->name, array( 'administrator', 'chair', 'director' ) ) || !$db_current_stage_type->decision ) $code = 403;
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
        $db_notification->email = $db_reqn->applicant_email;
        $db_notification->datetime = util::get_datetime_object();
        $db_notification->save();
      }
      else if( 'reactivate' == $action )
      {
        $db_reqn->state = 'deferred';
        $db_reqn->save();

        // send a notification
        $db_notification = lib::create( 'database\notification' );
        $db_notification->reqn_id = $db_reqn->id;
        $db_notification->notification_type_id =
          $notification_type_class_name::get_unique_record( 'name', 'Requisition Reactivated' )->id;
        $db_notification->email = $db_reqn->applicant_email;
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
        $db_current_stage_type = $db_reqn->get_current_stage_type();
        if( 'DSAC Review' == $db_current_stage_type->name )
        {
          // no decision is being made, so move to the SMT Decision stage, not the Approve stage
          $db_reqn->add_to_stage( 'SMT Decision' );
        }
        else
        {
          // add the reqn to whatever the next stage is
          $db_reqn->add_to_stage();
        }
      }
      else if( 'decide' == $action )
      {
        $stage_type = $this->get_argument( 'approve' ) ? 'Approved' : 'Not Approved';
        $db_reqn->add_to_stage( $stage_type );

        // send a notification
        $db_notification = lib::create( 'database\notification' );
        $db_notification->reqn_id = $db_reqn->id;
        $db_notification->notification_type_id =
          $notification_type_class_name::get_unique_record( 'name', 'Notice of decision' )->id;
        $db_notification->email = $db_reqn->applicant_email;
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

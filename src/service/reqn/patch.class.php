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
      $db_reqn_version = $db_reqn->get_current_reqn_version();
      $db_current_stage_type = $db_reqn->get_current_stage_type();
      $state = $db_reqn->state;
      $phase = $db_current_stage_type->phase;
      $code = NULL;
      if( 'reset_data' == $action )
      {
        if( 'administrator' != $db_role->name ||
            ( !in_array( $db_current_stage_type->name, array( 'Data Release', 'Active' ) ) ) ) $code = 403;
      }
      else if( 'abandon' == $action )
      {
        if( !in_array( $db_role->name, array( 'applicant', 'administrator' ) ) || 'deferred' != $state ) $code = 403;
        else if( '.' != $db_reqn_version->amendment )
        {
          // do not allow an amendment to be abandoned once it has gone past the admin review
          if( 'Admin Review' != $db_current_stage_type->name ) $code = 400;
        }
      }
      else if( 'deactivate' == $action )
      {
        if( 'administrator' != $db_role->name ) $code = 403;
      }
      else if( 'defer' == $action )
      {
        if( 'review' != $phase && 'active' != $phase ) $code = 403;
      }
      else if( 'amend' == $action )
      {
        if( !in_array( $db_role->name, array( 'applicant', 'administrator' ) ) ||
            'active' != $phase ||
            'Report Required' == $db_current_stage_type->name ) $code = 403;
      }
      else if( 'incomplete' == $action )
      {
        if( 'administrator' != $db_role->name ||
            '.' != $db_reqn_version->amendment ||
            ( 'review' != $phase && !in_array( $db_current_stage_type->name, array( 'Agreement', 'Data Release' ) ) ) ) $code = 403;
      }
      else if( 'withdraw' == $action )
      {
        if( 'administrator' != $db_role->name || 'active' != $phase ) $code = 403;
      }
      else if( 'reactivate' == $action )
      {
        if( 'administrator' != $db_role->name || !in_array( $state, [ 'abandoned', 'inactive' ] ) ) $code = 403;
      }
      else if( 'submit' == $action )
      {
        if( 'applicant' == $db_role->name || 'administrator' == $db_role->name )
        {
          if( 'new' != $phase && 'deferred' != $state ) $code = 403;
          else if( 'new' == $phase )
          {
            // check to make sure the start date is appropriate
            $delay = lib::create( 'business\setting_manager' )->get_setting( 'general', 'start_date_delay' );
            $db_reqn->save(); // this will make sure the deadline is appropriate
            if( $db_reqn->deadline_id )
            {
              $deadline = util::get_datetime_object( $db_reqn->get_deadline()->date );
              $deadline->add( new \DateInterval( sprintf( 'P%dM', $delay ) ) );
              if( $db_reqn_version->start_date < $deadline ) $code = 409;
            }
          }
        }
        else $code = 403;
      }
      else if( 'next_stage' == $action )
      {
        if( $this->get_argument( 'stage_type', false ) )
        {
          // only administrators can proceed to a specific stage type
          if( !is_null( $db_reqn->state ) || 'administrator' != $db_role->name ) $code = 403;
        }
        else
        {
          if( !is_null( $db_reqn->state ) || (
              'administrator' != $db_role->name &&
              ( 'chair' != $db_role->name || false === strpos( $db_current_stage_type->name, 'DSAC' ) ) &&
              ( 'smt' != $db_role->name || false === strpos( $db_current_stage_type->name, 'SMT' ) )
          ) ) $code = 403;
        }
      }
      else if( 'reject' == $action )
      {
        if( !is_null( $db_reqn->state ) ||
            !in_array( $db_role->name, array( 'administrator', 'chair' ) ) ||
            'DSAC Selection' != $db_current_stage_type->name ) $code = 403;
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
  public function prepare()
  {
    parent::prepare();

    // if we're changing the user_id then store the old one so that it can be referenced in the finish() method
    $patch_array = $this->get_file_as_array();
    if( array_key_exists( 'user_id', $patch_array ) )
    {
      $db_reqn = $this->get_leaf_record();
      $this->db_old_user = $db_reqn->get_user();
    }
  }

  /**
   * Extend parent method
   */
  public function execute()
  {
    parent::execute();

    $notification_type_class_name = lib::get_class_name( 'database\notification_type' );
    $notification_class_name = lib::get_class_name( 'database\notification' );
    $stage_type_class_name = lib::get_class_name( 'database\stage_type' );
    $session = lib::create( 'business\session' );
    $db_role = $session->get_role();
    $db_user = $session->get_user();
    $graduate = 'applicant' == $db_role->name && $db_user->is_graduate();

    $db_reqn = $this->get_leaf_record();
    $db_reqn_version = $db_reqn->get_current_reqn_version();
    $file = $this->get_argument( 'file', NULL );
    $headers = apache_request_headers();
    if( false !== strpos( $headers['Content-Type'], 'application/octet-stream' ) && !is_null( $file ) )
    {
      $filename = $db_reqn->get_filename( str_replace( '_filename', '', $file ) );
      if( false === file_put_contents( $filename, $this->get_file_as_raw() ) )
        throw lib::create( 'exception\runtime',
          sprintf( 'Unable to write file "%s"', $filename ),
          __METHOD__ );
    }
    else
    {
      $action = $this->get_argument( 'action', false );
      if( $action )
      {
        if( 'reset_data' == $action )
        {
          $this->set_data( $db_reqn->refresh_study_data_files() );
        }
        else if( 'abandon' == $action )
        {
          if( '.' == $db_reqn_version->amendment )
          {
            // abandon the requisition
            $db_reqn->state = 'abandoned';
            $db_reqn->save();
          }
          else
          {
            // remove the amendment's review
            $report_mod = lib::create( 'database\modifier' );
            $report_mod->where( 'amendment', '=', $db_reqn_version->amendment );
            foreach( $db_reqn->get_review_object_list( $report_mod ) as $db_review ) $db_review->delete();

            // remove the current stage and re-activate the previous one
            $db_current_stage = $db_reqn->get_current_stage();
            $db_current_stage->delete();
            $stage_mod = lib::create( 'database\modifier' );
            $stage_mod->order_desc( 'datetime' );
            $stage_mod->limit( 1 );
            $db_last_stage = current( $db_reqn->get_stage_object_list( $stage_mod ) );
            $db_last_stage->datetime = NULL;
            $db_last_stage->save();

            // delete the current (amendment) version
            $db_reqn_version->delete();

            // and finally, make sure the reqn is no longer deferred
            if( 'deferred' == $db_reqn->state )
            {
              $db_reqn->state = NULL;
              $db_reqn->save();
            }
          }
        }
        else if( 'deactivate' == $action )
        {
          // deactivate the requisition
          $db_reqn->state = 'inactive';
          $db_reqn->save();
        }
        else if( 'defer' == $action )
        {
          $db_reqn->state = 'deferred';
          $db_reqn->save();

          // create a new reqn version
          $db_reqn->create_version();

          // send a notification
          $db_notification = lib::create( 'database\notification' );
          $db_notification->notification_type_id =
            $notification_type_class_name::get_unique_record( 'name', 'Action required' )->id;
          $db_notification->set_reqn( $db_reqn ); // this saves the record
          $db_notification->mail();
        }
        else if( 'amend' == $action )
        {
          $db_reqn->state = 'deferred';
          $db_reqn->save();

          // create a new version using a new amendment code
          $db_reqn->create_version( true );

          // this will put the reqn to the start of the amendment process
          $db_reqn->proceed_to_next_stage( NULL, true ); // start a new amendment

          // send a notification
          $db_notification = lib::create( 'database\notification' );
          $db_notification->notification_type_id =
            $notification_type_class_name::get_unique_record( 'name', 'Amendment Started' )->id;
          $db_notification->set_reqn( $db_reqn ); // this saves the record
          $db_notification->mail();
        }
        else if( 'incomplete' == $action )
        {
          // move the requisition to incomplete
          $db_incomplete_stage = $stage_type_class_name::get_unique_record( 'name', 'Incomplete' );
          $db_reqn->proceed_to_next_stage( $db_incomplete_stage );
        }
        else if( 'withdraw' == $action )
        {
          // move the requisition to withdrawn
          $db_withdrawn_stage = $stage_type_class_name::get_unique_record( 'name', 'Withdrawn' );
          $db_reqn->proceed_to_next_stage( $db_withdrawn_stage );
        }
        else if( 'reactivate' == $action )
        {
          $db_reqn->state = 'abandoned' == $db_reqn->state ? 'deferred' : NULL;
          $db_reqn->save();

          // send a notification
          $db_notification = lib::create( 'database\notification' );
          $db_notification->notification_type_id =
            $notification_type_class_name::get_unique_record( 'name', 'Requisition Reactivated' )->id;
          $db_notification->set_reqn( $db_reqn ); // this saves the record
          $db_notification->mail();
        }
        else if( 'submit' == $action || 'next_stage' == $action || 'reject' == $action )
        {
          if( 'submit' == $action )
          {
            // graduates must be get approval from their supervisor
            if( $graduate )
            {
              // send a notification to the supervisor
              $db_notification = lib::create( 'database\notification' );
              $db_notification->notification_type_id =
                $notification_type_class_name::get_unique_record( 'name', 'Approval Required' )->id;
              $db_notification->set_reqn( $db_reqn );
              $db_notification->mail();
            }
            else
            {
              if( 'deferred' == $db_reqn->state )
              {
                $db_reqn->state = NULL;
                $db_reqn->save();

                // when resubmitting set the version's datetime
                $db_reqn_version->datetime = util::get_datetime_object();
                $db_reqn_version->save();
              }
              else
              {
                // this will submit the reqn for the first time
                $db_reqn->proceed_to_next_stage();
              }

              // send a notification
              $db_reqn_user = $db_reqn->get_user();
              $notification_class_name::mail_admin(
                sprintf( 'Requisition %s: submitted', $db_reqn->identifier ),
                sprintf(
                  "The following requisition has been submitted:\n".
                  "\n".
                  "Type: %s\n".
                  "Identifier: %s\n".
                  "Amendment: %s\n".
                  "Applicant: %s %s\n".
                  "Title: %s\n",
                  $db_reqn->get_reqn_type()->name,
                  $db_reqn->identifier,
                  str_replace( '.', 'no', $db_reqn_version->amendment ),
                  $db_reqn_user->first_name, $db_reqn_user->last_name,
                  $db_reqn_version->title
                )
              );
            }
          }
          else if( 'next_stage' == $action )
          {
            $db_reqn->proceed_to_next_stage( $this->get_argument( 'stage_type', NULL ) );
          }
          else if( 'reject' == $action )
          {
            // send directly to the decision-made stage type
            $db_stage_type = $stage_type_class_name::get_unique_record( 'name', 'Decision Made' );
            $db_reqn->proceed_to_next_stage( $db_stage_type );
          }
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

  /**
   * Extend parent method
   */
  public function finish()
  {
    $notification_type_class_name = lib::get_class_name( 'database\notification_type' );
    $notification_class_name = lib::get_class_name( 'database\notification' );

    parent::finish();

    // if we changed the user_id then we need to send a notification
    $db_reqn = $this->get_leaf_record();
    $patch_array = $this->get_file_as_array();
    if( array_key_exists( 'user_id', $patch_array ) )
    {
      $db_graduate = $db_reqn->get_graduate();
      if( !is_null( $db_graduate ) )
      {
        $db_graduate->user_id = $patch_array['user_id'];
        $db_graduate->save();
      }

      // send a notification
      $db_notification = lib::create( 'database\notification' );
      $db_notification->notification_type_id =
        $notification_type_class_name::get_unique_record( 'name', 'Change Owner' )->id;
      $db_notification->set_reqn( $db_reqn ); // this saves the record

      // we also want to add the old owner
      $db_notification->add_email(
        $this->db_old_user->email,
        sprintf( '%s %s', $this->db_old_user->first_name, $this->db_old_user->last_name )
      );

      $db_notification->mail();
    }
  }

  /**
   * Cache of the reqn's old user in case it gets changed
   * @var database\user
   * @access private
   */
  private $db_old_user = NULL;
}

<?php
/**
 * patch.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\manuscript;
use cenozo\lib, cenozo\log, magnolia\util;

class patch extends \cenozo\service\patch
{
  /**
   * Extend parent method
   */
  public function validate()
  {
    parent::validate();

    $db_manuscript = $this->get_leaf_record();

    $action = $this->get_argument( 'action', false );
    if( $action )
    {
      // define whether the action is allowed
      $db_role = lib::create( 'business\session' )->get_role();
      $db_manuscript_version = $db_manuscript->get_current_manuscript_version();
      $db_current_stage_type = $db_manuscript->get_current_manuscript_stage_type();
      $state = $db_manuscript->state;
      $phase = $db_current_stage_type->phase;
      $code = NULL;
      if( 'defer' == $action )
      {
        if( 'review' != $phase ) $code = 403;
      }
      else if( 'submit' == $action )
      {
        if( in_array( $db_role->name, array( 'applicant', 'designate', 'administrator' ) ) )
        {
          if( 'new' != $phase && 'deferred' != $state ) $code = 403;
        }
        else $code = 403;
      }
      else if( 'next_stage' == $action )
      {
        if(
          'administrator' != $db_role->name &&
          !( 'dao' == $db_role->name && 'DAO Review' == $db_current_stage_type->name )
        ) $code = 403;
      }
      else if( 'reverse' == $action )
      {
        $db_reqn = $db_manuscript->get_reqn();

        // only admins and dao are allowed to reverse a manuscript
        if( 'administrator' != $db_role->name ) $code = 403;
        else if(
          // don't allow if parent reqn is inactive or abandoned
          !in_array( $db_reqn->state, ['inactive', 'abandoned'] ) &&
          // don't allow if new (there's no stage to reverse to)
          'new' == $phase
        ) $code = 400;
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

    $action = $this->get_argument( 'action', false );
    if( !$action ) return;

    $notification_type_class_name = lib::get_class_name( 'database\notification_type' );
    $notification_class_name = lib::get_class_name( 'database\notification' );
    $session = lib::create( 'business\session' );
    $db_role = $session->get_role();
    $db_user = $session->get_user();

    $db_manuscript = $this->get_leaf_record();
    $db_reqn = $db_manuscript->get_reqn();
    $approval_required =
      'designate' == $db_role->name || (
        'applicant' == $db_role->name && (
          $db_reqn->trainee_user_id == $db_user->id || $db_reqn->designate_user_id == $db_user->id
        )
      );
    $db_manuscript_version = $db_manuscript->get_current_manuscript_version();

    $db_current_stage_type = $db_manuscript->get_current_manuscript_stage_type();
    $phase = $db_current_stage_type->phase;
    $stage_type = $db_current_stage_type->name;

    if( 'defer' == $action )
    {
      $db_manuscript->state = 'deferred';
      $db_manuscript->save();

      // create a new document version
      $db_manuscript->create_version();

      // send a notification
      $db_notification = lib::create( 'database\manuscript_notification' );
      $db_notification->notification_type_id =
        $notification_type_class_name::get_unique_record( 'name', 'Action required (manuscript)' )->id;
      $db_notification->set_manuscript( $db_manuscript ); // this saves the record
      $db_notification->mail();
    }
    else if( 'submit' == $action )
    {
      // trainees and proxies must be get approval from their supervisor
      if( $approval_required )
      {
        // send a notification to the supervisor
        $db_notification = lib::create( 'database\manuscript_notification' );
        $name = 'Approval Required, Manuscript Report';

        $db_notification->notification_type_id =
          $notification_type_class_name::get_unique_record( 'name', $name )->id;
        $db_notification->set_manuscript( $db_manuscript );
        $db_notification->mail();
      }
      else
      {
        if( 'deferred' == $db_manuscript->state )
        {
          $db_manuscript->state = NULL;
          $db_manuscript->save();

          // when resubmitting set the version/report datetime
          $db_manuscript_version->datetime = util::get_datetime_object();
          $db_manuscript_version->save();
        }
        else
        {
          // this will submit the manuscript for the first time
          $db_manuscript->proceed_to_manuscript_next_stage();
        }

        // send a notification
        $db_reqn_user = $db_reqn->get_user();
        $subject = sprintf(
          'Manuscript for %s: submitted',
          $db_reqn->identifier
        );
        $message = sprintf(
          "The following manuscript has been submitted:\n".
          "\n".
          "Identifier: %s\n".
          "Applicant: %s %s\n".
          "Manuscript Title: %s\n",
          $db_reqn->identifier,
          $db_reqn_user->first_name, $db_reqn_user->last_name,
          $db_manuscript->title
        );
        $notification_class_name::mail_admin( $subject, $message );
      }
    }
    else if( 'next_stage' == $action )
    {
      $db_manuscript->proceed_to_next_manuscript_stage( $this->get_argument( 'stage_type', NULL ) );
    }
    else if( 'reverse' == $action )
    {
      // reverse to the previous stage
      $db_manuscript->reverse_to_last_manuscript_stage();
    }
    else
    {
      log::warning( sprintf(
        'Received PATCH:manuscript/%d with unknown action "%s"',
        $db_manuscript->id,
        $action
      ) );
    }
  }
}

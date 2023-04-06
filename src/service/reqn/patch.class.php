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
    if( is_array( $patch_array ) && array_key_exists( 'language', $patch_array ) )
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
        // make sure only admins can release data to reqns in the data-release or active stages
        if( 'administrator' != $db_role->name ||
            ( !in_array( $db_current_stage_type->name, array( 'Data Release', 'Active' ) ) ) ) $code = 403;
        // make sure the reqn has at least one data-release
        else if( 0 == $db_reqn->get_data_release_count() )
        {
          throw lib::create( 'exception\notice',
            'The requisition has no data versions associated with it. '.
            'You must add at least one data version before study data can be released to the applicant.',
            __METHOD__
          );
        }
      }
      else if( 'abandon' == $action )
      {
        if( !in_array( $db_role->name, array( 'applicant', 'designate', 'administrator' ) ) ) $code = 403;
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
        if( !in_array( $phase, ['active','finalization','review'] ) ) $code = 403;
      }
      else if( 'amend' == $action )
      {
        if( !in_array( $db_role->name, array( 'applicant', 'designate', 'administrator', 'typist' ) ) ||
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
        if( 'administrator' != $db_role->name || !in_array( $state, ['abandoned', 'inactive'] ) ) $code = 403;
      }
      else if( 'submit' == $action )
      {
        if( in_array( $db_role->name, array( 'applicant', 'designate', 'administrator', 'typist' ) ) )
        {
          if( 'finalization' == $phase )
          {
            if( 'deferred' != $state ) $code = 403;
          }
          else
          {
            if( 'new' != $phase && 'deferred' != $state ) $code = 403;
            else if( !$db_reqn->legacy && 'new' == $phase )
            {
              // check to make sure the start date is appropriate (for non-consortium reqns)
              if( 'Consortium' != $db_reqn->get_reqn_type()->name )
              {
                $delay = lib::create( 'business\setting_manager' )->get_setting( 'general', 'start_date_delay' );
                $db_reqn->save(); // this will make sure the deadline is appropriate
                if( $db_reqn->deadline_id )
                {
                  $deadline = util::get_datetime_object( $db_reqn->get_deadline()->datetime );
                  $deadline->add( new \DateInterval( sprintf( 'P%dM', $delay ) ) );
                  if( $db_reqn_version->start_date < $deadline ) $code = 409;
                }
              }
            }
            else if( !$this->get_argument( 'review', true ) )
            {
              // only administrators and typists can skip a legacy amendment's review process
              if( 'administrator' != $db_role->name && 'typist' != $db_role->name )
              {
                $code = 403;
              }
              // only legacy amendment reviews can be skipped
              else if( '.' == $db_reqn_version->amendment || !$db_reqn->legacy )
              {
                throw lib::create( 'exception\notice',
                  'Only legacy amendments can skip the review process.',
                  __METHOD__
                );
              }
            }
          }
        }
        else $code = 403;
      }
      else if( 'next_stage' == $action )
      {
        if( $this->get_argument( 'stage_type', false ) )
        {
          // only administrators or typists with legacy applications can proceed to a specific stage type
          if( !is_null( $db_reqn->state ) ||
              ( 'administrator' != $db_role->name && ( 'typist' != $db_role->name || !$db_reqn->legacy ) ) ) $code = 403;
        }
        else
        {
          if( !is_null( $db_reqn->state ) || (
              'administrator' != $db_role->name &&
              ( 'chair' != $db_role->name || false === strpos( $db_current_stage_type->name, 'DSAC' ) ) &&
              ( 'ec' != $db_role->name || false === strpos( $db_current_stage_type->name, 'EC' ) ) &&
              (
                'communication' != $db_role->name ||
                false === strpos( $db_current_stage_type->name, 'Communication' )
              )
          ) ) $code = 403;
        }
      }
      else if( 'reverse' == $action )
      {
        // only admins are allowed to reverse a reqn
        if( 'administrator' != $db_role->name ) $code = 403;
        else if(
          // don't allow if deferred, inactive or abandoned, unless deferred with no notifications
          !( is_null( $db_reqn->state ) || ( "deferred" == $db_reqn->state && $db_reqn->disable_notification ) ) ||
          // don't allow if new (there's no stage to reverse to)
          'new' == $phase ||
          // use abandon for this instead
          ( '.' == $db_reqn_version->amendment && 'Admin Review' == $db_current_stage_type->name )
        ) $code = 400;
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
    if( is_array( $patch_array ) && array_key_exists( 'user_id', $patch_array ) )
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
    $review_type_class_name = lib::get_class_name( 'database\review_type' );
    $review_class_name = lib::get_class_name( 'database\review' );
    $recommendation_type_class_name = lib::get_class_name( 'database\recommendation_type' );
    $session = lib::create( 'business\session' );
    $db_role = $session->get_role();
    $db_user = $session->get_user();

    $db_reqn = $this->get_leaf_record();
    $approval_required =
      'designate' == $db_role->name || (
        'applicant' == $db_role->name && (
          $db_reqn->trainee_user_id == $db_user->id || $db_reqn->designate_user_id == $db_user->id
        )
      );
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
        $phase = $db_reqn->get_current_stage_type()->phase;
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
            // remove all of the amendment's versions and reviews
            $reqn_version_mod = lib::create( 'database\modifier' );
            $reqn_version_mod->where( 'amendment', '=', $db_reqn_version->amendment );
            $reqn_version_mod->order_desc( 'version' );
            foreach( $db_reqn->get_reqn_version_object_list( $reqn_version_mod ) as $db_amendment_reqn_version )
            {
              $report_mod = lib::create( 'database\modifier' );
              $report_mod->where( 'amendment', '=', $db_amendment_reqn_version->amendment );
              foreach( $db_reqn->get_review_object_list( $report_mod ) as $db_review ) $db_review->delete();
              $db_amendment_reqn_version->delete();
            }

            // remove the current stage and re-activate the previous one
            $db_current_stage = $db_reqn->get_current_stage();
            $db_current_stage->delete();
            $stage_mod = lib::create( 'database\modifier' );
            $stage_mod->order_desc( 'datetime' );
            $stage_mod->limit( 1 );
            $db_last_stage = current( $db_reqn->get_stage_object_list( $stage_mod ) );
            $db_last_stage->datetime = NULL;
            $db_last_stage->save();

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
          if( 'finalization' == $phase ) $db_reqn->create_final_report();
          else $db_reqn->create_version();

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
        else if( 'submit' == $action )
        {
          if( 'finalization' != $phase && !$this->get_argument( 'review', true ) )
          {
            // this is a legacy amendment that will skip the review process

            // first fill in the admin review
            $db_review = $review_class_name::get_unique_record(
              array( 'reqn_id', 'amendment', 'review_type_id' ),
              array( $db_reqn->id, $db_reqn_version->amendment, $review_type_class_name::get_unique_record( 'name', 'Admin' )->id )
            );
            $db_review->user_id = $db_user->id;
            $db_review->recommendation_type_id = $recommendation_type_class_name::get_unique_record( 'name', 'Satisfactory' )->id;
            $db_review->datetime = util::get_datetime_object();
            $db_review->note = 'Legacy amendment review process skipped.';
            $db_review->save();

            // remove from the deferred state
            $db_reqn->state = NULL;
            $db_reqn->save();

            // when resubmitting set the version/report datetime
            $db_reqn_version->datetime = util::get_datetime_object();
            $db_reqn_version->save();

            $db_reqn->proceed_to_next_stage( 'Active' );
          }
          // Do not proceed if this is a legacy reqn not in an amendment or finalization
          else if( !( $db_reqn->legacy && '.' == $db_reqn_version->amendment && 'finalization' != $phase ) )
          {
            // trainees and proxies must be get approval from their supervisor
            if( $approval_required )
            {
              // send a notification to the supervisor
              $db_notification = lib::create( 'database\notification' );
              $db_notification->notification_type_id = $notification_type_class_name::get_unique_record(
                'name',
                'finalization' == $phase ? 'Approval Required, Final Report' : 'Approval Required'
              )->id;
              $db_notification->set_reqn( $db_reqn );
              $db_notification->mail();
            }
            else
            {
              if( 'deferred' == $db_reqn->state )
              {
                $db_reqn->state = NULL;
                $db_reqn->save();

                // when resubmitting set the version/report datetime
                if( 'finalization' == $phase )
                {
                  $db_final_report = $db_reqn->get_current_final_report();
                  $db_final_report->datetime = util::get_datetime_object();
                  $db_final_report->save();

                  // if in the report required stage then proceed to the next one
                  if( 'Report Required' == $db_reqn->get_current_stage_type()->name )
                    $db_reqn->proceed_to_next_stage();
                }
                else
                {
                  $db_reqn_version->datetime = util::get_datetime_object();
                  $db_reqn_version->save();
                }
              }
              else
              {
                // this will submit the reqn for the first time
                $db_reqn->proceed_to_next_stage();
              }

              // send a notification
              $db_reqn_user = $db_reqn->get_user();
              $notification_class_name::mail_admin(
                sprintf(
                  '%s %s: submitted',
                  'finalization' == $phase ? 'Final Report' : 'Requisition',
                  $db_reqn->identifier
                ),
                sprintf(
                  "The following %s has been submitted:\n".
                  "\n".
                  "Type: %s\n".
                  "Identifier: %s\n".
                  "Applicant: %s %s\n".
                  "Title: %s\n",
                  'finalization' == $phase ? 'final report' : 'requisition',
                  $db_reqn->get_reqn_type()->name,
                  $db_reqn->identifier,
                  $db_reqn_user->first_name, $db_reqn_user->last_name,
                  $db_reqn_version->title
                )
              );
            }
          }
        }
        else if( 'next_stage' == $action )
        {
          $db_reqn->proceed_to_next_stage( $this->get_argument( 'stage_type', NULL ) );
        }
        else if( 'reverse' == $action )
        {
          // reverse to the previous stage
          $db_reqn->reverse_to_last_stage();
        }
        else if( 'reject' == $action )
        {
          // send directly to the decision-made stage type
          $db_stage_type = $stage_type_class_name::get_unique_record( 'name', 'Decision Made' );
          $db_reqn->proceed_to_next_stage( $db_stage_type );
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
    if( is_array( $patch_array ) && array_key_exists( 'user_id', $patch_array ) )
    {
      // if the reqn has a trainee then change their supervisor to the new user
      $db_trainee_user = $db_reqn->get_trainee_user();
      if( !is_null( $db_trainee_user ) )
      {
        $db_applicant = $db_trainee_user->get_applicant();
        $db_applicant->supervisor_user_id = $db_reqn->user_id;
        $db_applicant->save();
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

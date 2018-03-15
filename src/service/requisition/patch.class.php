<?php
/**
 * patch.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\requisition;
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
      $db_requisition = $this->get_leaf_record();
      $db_stage_type = $db_requisition->get_last_stage()->get_stage_type();
      $state = $db_requisition->state;
      $phase = $db_stage_type->phase;
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
        if( !$administrator || ( 'review' != $phase && 'defered' != $state ) ) $code = 403;
      }
      else if( 'submit' == $action )
      {
        if( $administrator )
        {
          if( 'review' != $phase && 'agreement' != $phase ) $code = 403;
        }
        else if( $applicant )
        {
          if( 'new' != $phase && 'defered' != $state ) $code = 403;
        }
        else $code = 403;
      }
      else if( 'decide' == $action )
      {
        if( !$administrator || 'SMT Review' != $db_stage_type->name ) $code = 403;
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
      $db_requisition = $this->get_leaf_record();
      if( 'abandon' == $action )
      {
        $db_requisition->state = 'abandoned';
        $db_requisition->save();
      }
      else if( 'defer' == $action )
      {
        $db_requisition->state = 'deferred';
        $db_requisition->save();
        log::info( sprintf(
          'Send "Action required" notification email to applicant of %s',
          $db_requisition->identifier
        ) );
      }
      else if( 'reactivate' == $action )
      {
        $db_requisition->state = NULL;
        $db_requisition->save();
      }
      else if( 'prepare' == $action )
      {
        $db_last_stage = $db_requisition->get_last_stage();
        $db_last_stage->unprepared = false;
        $db_last_stage->save();
      }
      else if( 'reject' == $action )
      {
        $db_requisition->state = 'rejected';
        $db_requisition->save();
        log::info( sprintf(
          'Send "Rejected" notification email to applicant of %s',
          $db_requisition->identifier
        ) );
      }
      else if( 'submit' == $action )
      {
        if( 'deferred' == $db_requisition->state )
        {
          $db_requisition->state = NULL;
          $db_requisition->save();
        }
        else
        {
          // add the requisition to whatever the next stage is
          $db_requisition->add_to_stage();
        }
      }
      else if( 'decide' == $action )
      {
        $approve = $this->get_argument( 'approve' );
        $stage_type = NULL;
        if( 'yes' == $approve ) $stage_type = 'Approved';
        else if( 'conditional' == $approve ) $stage_type = 'Conditionally Approved';
        else if( 'no' == $approve ) $stage_type = 'Not Approved';
        $db_requisition->add_to_stage( $stage_type );
        log::info( sprintf(
          'Send "Notice of Decision" notification email to applicant of %s',
          $db_requisition->identifier
        ) );
      }
      else
      {
        log::warning( sprintf(
          'Received PATCH:requisition/%d with unknown action "%s"',
          $db_requisition->id,
          $action
        ) );
      }
    }
  }
}

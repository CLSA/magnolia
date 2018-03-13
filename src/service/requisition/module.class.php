<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\requisition;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Performs operations which effect how this module is used in a service
 */
class module extends \cenozo\service\module
{
  /**
   * Extend parent method
   */
  public function validate()
  {
    parent::validate();

    $session = lib::create( 'business\session' );
    $db_user = $session->get_user();
    $db_role = $session->get_role();

    if( 300 > $this->get_status()->get_code() )
    {
      // make sure to restrict applicants to their own requisitions
      $db_requisition = $this->get_resource();
      if( 'applicant' == $db_role->name && !is_null( $db_requisition ) )
      {
        if( $db_requisition->user_id != $db_user->id )
        {
          $this->get_status()->set_code( 404 );
          return;
        }
      }
    }
  }

  /**
   * Extend parent method
   */
  public function prepare_read( $select, $modifier )
  {
    parent::prepare_read( $select, $modifier );

    $session = lib::create( 'business\session' );
    $db_user = $session->get_user();
    $db_role = $session->get_role();

    $modifier->join( 'deadline', 'requisition.deadline_id', 'deadline.id' );

    // only show applicants their own requisitions
    if( 'applicant' == $db_role->name ) $modifier->where( 'requisition.user_id', '=', $db_user->id );

    if( $select->has_column( 'user_full_name' ) )
    {
      $modifier->join( 'user', 'requisition.user_id', 'user.id' );
      $select->add_table_column(
        'user', 'CONCAT_WS( " ", user.first_name, user.last_name )', 'user_full_name', false );
    }

    if( $select->has_table_columns( 'stage_type' ) )
    {
      $modifier->join( 'requisition_last_stage', 'requisition.id', 'requisition_last_stage.requisition_id' );
      $modifier->join( 'stage', 'requisition_last_stage.stage_id', 'stage.id' );
      $modifier->join( 'stage_type', 'stage.stage_type_id', 'stage_type.id' );

      if( $select->has_table_column( 'stage_type', 'status' ) )
      {
        // show admin stages before deadline as waiting for review
        $select->add_table_column(
          'stage_type',
          'IF( '.
          '  "review" = stage_type.phase AND deadline.date > DATE( UTC_TIMESTAMP() ), '.
          '  "Waiting for Review", '.
          '  stage_type.status '.
          ')',
          'status',
          false
        );
      }
    }
  }
}

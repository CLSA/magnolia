<?php
/**
 * requisition.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\business\report;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Call history report
 */
class requisition extends \cenozo\business\report\base_report
{
  /**
   * Build the report
   * @access protected
   */
  protected function build()
  {
    $reqn_class_name = lib::get_class_name( 'database\reqn' );
    $today = util::get_datetime_object();

    $data = array();

    $select = lib::create( 'database\select' );
    $modifier = lib::create( 'database\modifier' );

    $select->from( 'reqn' );
    $select->add_column( 'Identifier', 'Identifier' );

    // apply the custom restriction to the stage type (must be in or have been in)
    foreach( $this->get_restriction_list() as $restriction )
    {
      if( 'stage_type' == $restriction['name'] && !is_null( $restriction['value'] ) )
      {
        $modifier->join( 'stage', 'reqn.id', 'stage.reqn_id' );
        $modifier->where( 'stage.stage_type_id', '=', $restriction['value'] );
      }
    }

    // join to the current version and order by the identifier
    $modifier->join( 'reqn_current_reqn_version', 'reqn.id', 'reqn_current_reqn_version.reqn_id' );
    $modifier->join( 'reqn_version', 'reqn_current_reqn_version.reqn_version_id', 'reqn_version.id' );
    $modifier->order( 'reqn.identifier' );

    // add the applicant
    ////////////////////////////////////////////////////////////////////////////////////////////////
    $select->add_column( 'CONCAT_WS( " ", user.first_name, user.last_name )', 'Primary Applicant', false );
    $select->add_column( 'reqn_version.applicant_affiliation', 'Institution', false );

    $select->add_column( 'reqn_version.title', 'Title', false );
    $select->add_column( 'IF( reqn_version.ethics, "Yes", "No" )', 'Ethics', false ); 

    $modifier->join( 'user', 'reqn.user_id', 'user.id' );
      
    $this->add_table_from_select( NULL, $reqn_class_name::select( $select, $modifier ) );
  }
}

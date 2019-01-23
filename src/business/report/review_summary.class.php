<?php
/**
 * review_summary.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\business\report;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Call history report
 */
class review_summary extends \cenozo\business\report\base_report
{
  /**
   * Build the report
   * @access protected
   */
  protected function build()
  {
    $reqn_class_name = lib::get_class_name( 'database\reqn' );

    $select = lib::create( 'database\select' );
    $select->from( 'reqn' );
    $select->add_column( 'identifier', 'Identifier' );
    $select->add_column( 'reqn_version.applicant_name', 'Applicant', false );
    $select->add_column( 'reqn_version.applicant_affiliation', 'Affiliation', false );
    $select->add_column( 'reqn_version.title', 'Title', false );
    $select->add_column( 'reqn_version.lay_summary', 'Lay Summary', false );
    $select->add_column(
      "GROUP_CONCAT(\n".
      "  CONCAT(\n".
      "    review_type.name,\n".
      "    ': ',\n".
      "    recommendation_type.name,\n".
      "    '\\n',\n".
      "    IFNULL( review.note, '(no comment)' )\n".
      "  )\n".
      "  SEPARATOR '\\n\\n'\n".
      ")",
      'Reviews',
      false
    );

    $modifier = lib::create( 'database\modifier' );
    $modifier->join( 'reqn_current_reqn_version', 'reqn.id', 'reqn_current_reqn_version.reqn_id' );
    $modifier->join( 'reqn_version', 'reqn_current_reqn_version.reqn_version_id', 'reqn_version.id' );
    $modifier->join( 'review', 'reqn.id', 'review.reqn_id' );
    $modifier->join( 'review_type', 'review.review_type_id', 'review_type.id' );
    $modifier->join( 'recommendation_type', 'review.recommendation_type_id', 'recommendation_type.id' );
    $modifier->group( 'reqn.id' );
    $modifier->order( 'reqn.identifier' );
      
    foreach( $this->get_restriction_list() as $restriction )
    {
      if( 'stage_type' == $restriction['name'] && !is_null( $restriction['value'] ) )
      {
        $join_mod = lib::create( 'database\modifier' );
        $join_mod->where( 'reqn.id', '=', 'stage.reqn_id', false );
        $join_mod->where( 'stage.datetime', '=', NULL );
        $modifier->join_modifier( 'stage', $join_mod );
        $modifier->where( 'stage.stage_type_id', '=', $restriction['value'] );
      }
    }
    
    $this->add_table_from_select( NULL, $reqn_class_name::select( $select, $modifier ) );
  }
}

<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\data_option_detail;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Performs operations which effect how this module is used in a service
 */
class module extends \cenozo\service\module
{
  /**
   * Extend parent method
   */
  public function prepare_read( $select, $modifier )
  {
    parent::prepare_read( $select, $modifier );

    $modifier->join( 'data_option', 'data_option_detail.data_option_id', 'data_option.id' );

    if( $select->has_column( 'footnote_id_list' ) )
    {
      $modifier->left_join(
        'data_option_detail_has_footnote',
        'data_option_detail.id',
        'data_option_detail_has_footnote.data_option_detail_id'
      );
      $modifier->group( 'data_option_detail.id' );

      $select->add_column( 'GROUP_CONCAT( DISTINCT data_option_detail_has_footnote.footnote_id )', 'footnote_id_list', false );
    }

    if( $select->has_column( 'study_phase_list' ) )
    {
      $modifier->join(
        'data_option_detail_has_study_phase',
        'data_option_detail.id',
        'data_option_detail_has_study_phase.data_option_detail_id'
      );
      $modifier->join(
        'study_phase',
        'data_option_detail_has_study_phase.study_phase_id',
        'study_phase.id'
      );
      $modifier->group( 'data_option_detail.id' );

      $select->add_column( 'GROUP_CONCAT( DISTINCT study_phase.name ORDER BY study_phase.rank )', 'study_phase_list', false );
    }
  }
}

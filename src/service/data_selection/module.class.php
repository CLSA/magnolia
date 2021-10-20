<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\data_selection;
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

    $modifier->join( 'data_option', 'data_selection.data_option_id', 'data_option.id' );
    $modifier->join( 'study_phase', 'data_selection.study_phase_id', 'study_phase.id' );
    $modifier->join( 'study', 'study_phase.study_id', 'study.id' );
    if( $select->has_table_columns( 'data_category' ) )
      $modifier->join( 'data_category', 'data_option.data_category_id', 'data_category.id' );

    if( $select->has_column( 'is_unavailable' ) )
      $select->add_column( 'unavailable_en IS NOT NULL AND unavailable_fr IS NOT NULL', 'is_unavailable', false );
  }
}

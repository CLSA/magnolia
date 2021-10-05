<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\data_option_category;
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

    if( $select->has_column( 'study_phase_code_list' ) )
    {
      $modifier->join(
        'data_option_category_has_study_phase',
        'data_option_category.id',
        'data_option_category_has_study_phase.data_option_category_id'
      );
      $modifier->join(
        'study_phase',
        'data_option_category_has_study_phase.study_phase_id',
        'study_phase.id'
      );
      $modifier->group( 'data_option_category.id' );

      $select->add_column( 'GROUP_CONCAT( study_phase.code )', 'study_phase_code_list', false );
    }

    if( $select->has_column( 'has_condition' ) )
    {
      $select->add_column(
        'data_option_category.condition_en IS NOT NULL OR data_option_category.condition_fr IS NOT NULL',
        'has_condition',
        false
      );
    }
  }
}

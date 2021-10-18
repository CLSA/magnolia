<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\data_category;
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

    if( $select->has_column( 'study_phase_list' ) )
    {
      $modifier->join(
        'data_category_has_study_phase',
        'data_category.id',
        'data_category_has_study_phase.data_category_id'
      );
      $modifier->join(
        'study_phase',
        'data_category_has_study_phase.study_phase_id',
        'study_phase.id'
      );
      $modifier->join( 'study', 'study_phase.study_id', 'study.id' );
      $modifier->group( 'data_category.id' );

      // provide the list of all study phases delimited by a ";", with the study and study-phase names delimited by a "`"
      $select->add_column(
        'GROUP_CONCAT( CONCAT( '.
          'REPLACE( REPLACE( LOWER( study.name ), " ", "_" ), "-", "_" ), '.
          '"`", '.
          'study_phase.code '.
        ') SEPARATOR ";" )',
        'study_phase_list',
        false
      );
    }

    if( $select->has_column( 'has_condition' ) )
    {
      $select->add_column(
        'data_category.condition_en IS NOT NULL OR data_category.condition_fr IS NOT NULL',
        'has_condition',
        false
      );
    }
  }
}

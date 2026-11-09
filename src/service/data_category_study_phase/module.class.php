<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\data_category_study_phase;
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

    $modifier->join( 'data_category', 'data_category_study_phase.data_category_id', 'data_category.id' );
    $modifier->join( 'study_phase', 'data_category_study_phase.study_phase_id', 'study_phase.id' );
    $modifier->join( 'study', 'study_phase.study_id', 'study.id' );
  }
}

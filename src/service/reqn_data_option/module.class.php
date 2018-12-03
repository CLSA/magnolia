<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\reqn_data_option;
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

    $modifier->join( 'reqn', 'reqn_data_option.reqn_id', 'reqn.id' );
    $modifier->join( 'data_option', 'reqn_data_option.data_option_id', 'data_option.id' );
    $modifier->join( 'study_phase', 'reqn_data_option.study_phase_id', 'study_phase.id' );
  }
}

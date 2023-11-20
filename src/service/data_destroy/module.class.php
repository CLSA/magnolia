<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\data_destroy;
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

    $modifier->join( 'reqn', 'data_destroy.reqn_id', 'reqn.id' );
    $modifier->join( 'language', 'reqn.language_id', 'language.id' );
    $modifier->join( 'reqn_current_destruction_report', 'reqn.id', 'reqn_current_destruction_report.reqn_id' );
    $modifier->left_join(
      'destruction_report',
      'reqn_current_destruction_report.destruction_report_id',
      'destruction_report.id'
    );
  }
}

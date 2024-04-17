<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\manuscript_attachment;
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

    $modifier->join( 'manuscript', 'manuscript_attachment.manuscript_id', 'manuscript.id' );

    if( $select->has_column( 'size' ) )
      $select->add_column( 'CHAR_LENGTH( manuscript_attachment.data ) / 4 * 3', 'size', false, 'int' );
  }
}

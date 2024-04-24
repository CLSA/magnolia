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
  protected static $base64_column_list = ['data' => 'application/octet-stream']; // allow any file type

  /**
   * Extend parent method
   */
  public function prepare_read( $select, $modifier )
  {
    parent::prepare_read( $select, $modifier );

    $modifier->join( 'manuscript', 'manuscript_attachment.manuscript_id', 'manuscript.id' );

    if( $select->has_column( 'size' ) )
    {
      // Size of base64 encoded file is (n * (3/4)) - y
      // where y is 2 if base64 ends with "==" and 1 if base64 ends with "="
      $select->add_column(
        'CHAR_LENGTH( manuscript_attachment.data ) * (3/4) - '.
        'IF(RIGHT(data,2) = "==", 2, IF(RIGHT(data,1) = "=", 1, 0))',
        'size',
        false,
        'int'
      );
    }
  }
}

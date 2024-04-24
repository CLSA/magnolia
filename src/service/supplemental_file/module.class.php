<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\supplemental_file;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Performs operations which effect how this module is used in a service
 */
class module extends \cenozo\service\module
{
  /** 
   * Extend parent property
   */
  protected static $base64_column_list = [
    'data_en' => 'application/pdf',
    'data_fr' => 'application/pdf'
  ];
}

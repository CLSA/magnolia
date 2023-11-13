<?php
/**
 * patch.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\supplemental_file;
use cenozo\lib, cenozo\log, magnolia\util;

class patch extends \cenozo\service\patch
{
  /** 
   * Extend parent property
   */
  protected static $base64_column_list = [
    'data_en' => 'application/pdf',
    'data_fr' => 'application/pdf'
  ];
}

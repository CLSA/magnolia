<?php
/**
 * get.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\pdf_form;
use cenozo\lib, cenozo\log, magnolia\util;

class get extends \cenozo\service\get
{
  /**
   * Extend parent property
   */
  protected static $base64_column_list = ['data' => 'application/pdf'];
}

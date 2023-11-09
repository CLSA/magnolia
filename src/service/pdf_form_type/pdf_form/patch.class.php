<?php
/**
 * patch.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\pdf_form_type\pdf_form;
use cenozo\lib, cenozo\log, magnolia\util;

class patch extends \cenozo\service\patch
{
  /**
   * Extend parent property
   */
  protected static $base64_column_list = ['data' => 'application/pdf'];
}

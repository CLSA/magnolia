<?php
/**
 * data_agreement.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * data_agreement: record
 */
class data_agreement extends \cenozo\database\record
{
  /**
   * Override the parent method
   */
  public function delete()
  {
    $file = is_null( $this->filename ) ? NULL : $this->get_filename();
    parent::delete();
    if( !is_null( $file ) && file_exists( $file ) ) unlink( $file );
  }

  /**
   * Returns the path to the publication's file
   * 
   * @return string
   * @access public
   */
  public function get_filename()
  {
    return sprintf( '%s/%s', DATA_AGREEMENT_FORM_PATH, $this->id );
  }
}

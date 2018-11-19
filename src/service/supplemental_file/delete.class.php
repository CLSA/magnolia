<?php
/**
 * delete.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\supplemental_file;
use cenozo\lib, cenozo\log, magnolia\util;

class delete extends \cenozo\service\delete
{
  /**
   * Extends parent method
   */
  protected function execute()
  {
    $db_supplemental = $this->get_leaf_record();
    $filename_en = $db_supplemental->get_filename( 'en' );
    $filename_fr = $db_supplemental->get_filename( 'fr' );

    parent::execute();

    // delete all files
    if( file_exists( $filename_en ) ) unlink( $filename_en );
    if( file_exists( $filename_fr ) ) unlink( $filename_fr );
  }
}

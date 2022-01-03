<?php
/**
 * supplemental_file.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * supplemental_file: record
 */
class supplemental_file extends \cenozo\database\record
{
  /**
   * Override the parent method
   */
  public function save()
  {
    parent::save();

    // delete files if they are being set to null
    if( is_null( $this->filename_en ) )
    {
      $filename = $this->get_filename( 'en' );
      if( file_exists( $filename ) ) unlink( $filename );
    }
    if( is_null( $this->filename_fr ) )
    {
      $filename = $this->get_filename( 'fr' );
      if( file_exists( $filename ) ) unlink( $filename );
    }
  }

  /**
   * Override the parent method
   */
  public function delete()
  {
    $file_list = array();
    if( !is_null( $this->filename_en ) ) $file_list[] = $this->get_filename( 'en' );
    if( !is_null( $this->filename_fr ) ) $file_list[] = $this->get_filename( 'fr' );

    parent::delete();

    foreach( $file_list as $file ) if( file_exists( $file ) ) unlink( $file );
  }

  /**
   * Returns the path to the english file
   * 
   * @param string $lang Either 'en' or 'fr'
   * @return string
   * @public
   */
  public function get_filename( $lang )
  {
    if( 'en' != $lang && 'fr' != $lang ) throw lib::create( 'exception\argument', 'lang', $lang, __METHOD__ );
    return sprintf( '%s/%s_%s', SUPPLEMENTAL_FILE_PATH, $lang, $this->id );
  }
}

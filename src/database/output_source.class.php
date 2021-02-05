<?php
/**
 * output_source.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * output_source: record
 */
class output_source extends \cenozo\database\record
{
  /**
   * Override the parent method
   */
  public function save()
  {
    parent::save();

    // delete the file if it is being set to null
    if( is_null( $this->filename ) )
    {
      $filename = $this->get_filename();
      if( file_exists( $filename ) ) unlink( $filename );
    }
  }

  /**
   * Override the parent method
   */
  public function delete()
  {
    $file = is_null( $this->filename ) ? NULL : $this->get_filename();
    parent::delete();
    if( !is_null( $file ) ) unlink( $file );
  }

  /**
   * Returns the path to the publication's file
   * 
   * @return string
   * @access public
   */
  public function get_filename()
  {
    return sprintf( '%s/%s', OUTPUT_SOURCE_PATH, $this->id );
  }
}

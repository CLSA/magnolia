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

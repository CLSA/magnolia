<?php
/**
 * publication.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * publication: record
 */
class publication extends \cenozo\database\record
{
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
    return sprintf( '%s/%s', PUBLICATION_PATH, $this->id );
  }
}

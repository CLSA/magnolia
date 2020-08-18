<?php
/**
 * ethics_approval.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * ethics_approval: record
 */
class ethics_approval extends \cenozo\database\record
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
   * Returns the path to the ethics_approval's file
   * 
   * @return string
   * @access public
   */
  public function get_filename()
  {
    return sprintf( '%s/%s', ETHICS_APPROVAL_PATH, $this->id );
  }
}

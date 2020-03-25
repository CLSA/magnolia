<?php
/**
 * applicant.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * applicant: record
 */
class applicant extends \cenozo\database\record
{
  /**
   * Convenience method to get the supervisor user record
   * @return database\user
   */
  public function get_supervisor_user()
  {
    return is_null( $this->supervisor_user_id ) ?  NULL : lib::create( 'database\user', $this->supervisor_user_id );
  }
}

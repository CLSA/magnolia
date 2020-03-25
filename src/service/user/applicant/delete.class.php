<?php
/**
 * delete.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\user\applicant;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Extends parent class
 */
class delete extends \cenozo\service\delete
{
  /**
   * Extends parent method
   */
  protected function prepare()
  {
    parent::prepare();

    // the status will always be a 404 because the user/applicant relationship is not a standard one-to-many
    if( 404 == $this->status->get_code() )
    {
      $this->status->set_code( 200 );
    }
  }

  /**
   * Overrides parent method
   */
  protected function execute()
  {
    // remove this user as the supervisor in the applicant's record
    $db_applicant = $this->get_leaf_record();
    $db_applicant->supervisor_user_id = NULL;
    $db_applicant->save();
  }
}

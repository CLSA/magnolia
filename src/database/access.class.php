<?php
/**
 * access.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

class access extends \cenozo\database\access
{
  /**
   * Override parent save method by making sure that higher tiers cannot be created
   * 
   * @throws exception\permission
   * @access public
   */
  public function save()
  {
    parent::save();

    // make sure the user has an applicant record if they have been granted applicant or designate access
    if( in_array( $this->get_role()->name, ['applicant', 'designate'] ) ) $this->get_user()->assert_applicant();
  }
}

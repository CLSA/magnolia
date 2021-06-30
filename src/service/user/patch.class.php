<?php
/**
 * patch.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\user;
use cenozo\lib, cenozo\log, magnolia\util;

class patch extends \cenozo\service\user\patch
{
  /**
   * Extend parent method
   */
  public function get_file_as_array()
  {
    $patch_array = parent::get_file_as_array();

    // remove supervisor_user_id from the patch array
    if( array_key_exists( 'supervisor_user_id', $patch_array ) )
    {
      $this->supervisor_user_id = $patch_array['supervisor_user_id'];
      $this->update_supervisor = true;
      unset( $patch_array['supervisor_user_id'] );
    }

    return $patch_array;
  }

  /**
   * Override parent method
   */
  protected function execute()
  {
    parent::execute();

    // process the supervisor, if it exists
    if( $this->update_supervisor ) $this->set_supervisor();
  }

  /**
   * Sets the user's supervisor
   */
  protected function set_supervisor()
  {
    $db_applicant = $this->get_leaf_record()->get_applicant();
    $db_applicant->supervisor_user_id = $this->supervisor_user_id;
    $db_applicant->save();
  }

  /**
   * Whether the supervisor needs to be updated
   * @var boolean
   * @access protected
   */
  protected $update_supervisor = false;

  /**
   * What to chante the user's supervisor to
   * @var int
   * @access protected
   */
  protected $supervisor_user_id = NULL;
}

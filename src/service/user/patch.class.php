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

    // remove newsletter from the patch array
    if( array_key_exists( 'newsletter', $patch_array ) )
    {
      $this->newsletter = $patch_array['newsletter'];
      $this->update_newsletter = true;
      unset( $patch_array['newsletter'] );
    }

    // remove note from the patch array
    if( array_key_exists( 'note', $patch_array ) )
    {
      $this->note = $patch_array['note'];
      $this->update_note = true;
      unset( $patch_array['note'] );
    }

    return $patch_array;
  }

  /**
   * Override parent method
   */
  protected function execute()
  {
    parent::execute();

    // process the extra data, if it exists
    $db_applicant = $this->get_leaf_record()->get_applicant();
    if( $this->update_supervisor ) $db_applicant->supervisor_user_id = $this->supervisor_user_id;
    if( $this->update_newsletter ) $db_applicant->newsletter = $this->newsletter;
    if( $this->update_note ) $db_applicant->note = $this->note;
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

  /**
   * Whether the newsletter needs to be updated
   * @var boolean
   * @access protected
   */
  protected $update_newsletter = false;

  /**
   * What to chante the user's newsletter to
   * @var int
   * @access protected
   */
  protected $newsletter = NULL;

  /**
   * Whether the note needs to be updated
   * @var boolean
   * @access protected
   */
  protected $update_note = false;

  /**
   * What to chante the user's note to
   * @var int
   * @access protected
   */
  protected $note = NULL;
}

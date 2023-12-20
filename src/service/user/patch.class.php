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
   * Override parent method
   */
  protected function prepare()
  {
    $this->extract_parameter_list = array_merge(
      $this->extract_parameter_list,
      ['supervisor_user_id', 'suspended', 'newsletter', 'note']
    );

    parent::prepare();
  }

  /**
   * Override parent method
   */
  protected function execute()
  {
    parent::execute();

    // process the extra data, if it exists
    $db_applicant = $this->get_leaf_record()->get_applicant();

    $supervisor_user_id = $this->get_argument( 'supervisor_user_id', -1 );
    if( -1 !== $supervisor_user_id ) $db_applicant->supervisor_user_id = $supervisor_user_id;

    $suspended = $this->get_argument( 'suspended', -1 );
    if( -1 !== $suspended ) $db_applicant->suspended = $suspended;

    $newsletter = $this->get_argument( 'newsletter', -1 );
    if( -1 !== $newsletter ) $db_applicant->newsletter = $newsletter;

    $note = $this->get_argument( 'note', -1 );
    if( -1 !== $note ) $db_applicant->note = $note;

    $db_applicant->save();
  }
}

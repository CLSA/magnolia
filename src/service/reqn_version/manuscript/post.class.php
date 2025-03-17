<?php
/**
 * post.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\reqn_version\manuscript;
use cenozo\lib, cenozo\log, magnolia\util;

class post extends \cenozo\service\post
{
  /**
   * Extend parent method
   */
  public function validate()
  {
    parent::validate();

    $code = NULL;
    $db_reqn_version = $this->get_parent_record();

    // make sure the agreement hasn't expired
    $diff = util::get_interval( $db_reqn_version->agreement_end_date );
    if( 0 == $diff->invert && 0 < $diff->days ) $this->status->set_code( 409 );
  }

  /**
   * Extend parent method
   */
  protected function prepare()
  {
    parent::prepare();

    // set the manuscript's reqn_id from the reqn_version record
    $db_reqn_version = $this->get_parent_record();
    $db_manuscript = $this->get_leaf_record();
    $db_manuscript->reqn_id = $db_reqn_version->reqn_id;
  }
}

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
   * Replace parent method
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

<?php
/**
 * post.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\destruction_report\data_destroy;
use cenozo\lib, cenozo\log, magnolia\util;

class post extends \cenozo\service\post
{
  /**
   * Replace parent method
   */
  protected function setup()
  {
    parent::setup();

    // set the new data_destroy's reqn_id to be the same as the destruction report's reqn_id
    $db_data_destroy = $this->get_leaf_record();
    $db_data_destroy->reqn_id = $this->get_parent_record()->reqn_id;
  }
}

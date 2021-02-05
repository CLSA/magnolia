<?php
/**
 * post.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\final_report\output;
use cenozo\lib, cenozo\log, magnolia\util;

class post extends \cenozo\service\post
{
  /**
   * Replace parent method
   */
  protected function setup()
  {
    parent::setup();

    // set the new output's reqn_id to be the same as the final report's reqn_id
    $db_output = $this->get_leaf_record();
    $db_output->reqn_id = $this->get_parent_record()->reqn_id;
  }
}

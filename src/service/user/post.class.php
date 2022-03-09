<?php
/**
 * post.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\user;
use cenozo\lib, cenozo\log, magnolia\util;

class post extends \cenozo\service\post
{
  /**
   * Replace parent method
   */
  protected function execute()
  {
    parent::execute();

    $post_object = $this->get_file_as_object();
    
    $db_applicant = $this->get_leaf_record()->get_applicant();
    $db_applicant->newsletter = $post_object->newsletter;
    $db_applicant->note = $post_object->note;
    $db_applicant->save();
  }
}

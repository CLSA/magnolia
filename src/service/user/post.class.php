<?php
/**
 * post.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\user;
use cenozo\lib, cenozo\log, magnolia\util;

class post extends \cenozo\service\user\post
{
  /**
   * Replace parent method
   */
  protected function execute()
  {
    parent::execute();

    if( $this->may_continue() )
    {
      $post_object = $this->get_file_as_object();
      if( property_exists( $post_object, 'suspended' ) ||
          property_exists( $post_object, 'newsletter' ) ||
          property_exists( $post_object, 'note' ) )
      {
        $db_applicant = $this->get_leaf_record()->get_applicant();
        if( property_exists( $post_object, 'suspended' ) ) $db_applicant->suspended = $post_object->suspended;
        if( property_exists( $post_object, 'newsletter' ) ) $db_applicant->newsletter = $post_object->newsletter;
        if( property_exists( $post_object, 'note' ) ) $db_applicant->note = $post_object->note;
        $db_applicant->save();
      }
    }
  }
}

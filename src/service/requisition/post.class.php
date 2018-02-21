<?php
/**
 * post.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\requisition;
use cenozo\lib, cenozo\log, magnolia\util;

class post extends \cenozo\service\post
{
  /**
   * Replace parent method
   */
  protected function prepare()
  {
    parent::prepare();

    $language_class_name = lib::get_class_name( 'database\language' );

    // if the language_id isn't set then default to English
    $db_reference = $this->get_leaf_record();
    if( is_null( $db_reference->language_id ) )
      $db_reference->language_id = $language_class_name::get_unique_record( 'code', 'en' )->id;
  }
}

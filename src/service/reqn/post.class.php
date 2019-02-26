<?php
/**
 * post.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\reqn;
use cenozo\lib, cenozo\log, magnolia\util;

class post extends \cenozo\service\post
{
  /**
   * Replace parent method
   */
  protected function prepare()
  {
    parent::prepare();

    $reqn_class_name = lib::get_class_name( 'database\reqn' );
    $language_class_name = lib::get_class_name( 'database\language' );
    $graduate_class_name = lib::get_class_name( 'database\graduate' );
    $db_reqn = $this->get_leaf_record();

    // if no type has been selected then assume standard
    if( is_null( $db_reqn->reqn_type_id ) )
    {
      $db_reqn_type = lib::get_unique_record( 'name', 'Standard' );
      $db_reqn->reqn_type_id = $db_reqn_type->id;
    }

    // generate a random identifier if none exists
    if( is_null( $db_reqn->identifier ) ) $db_reqn->identifier = $reqn_class_name::get_temporary_identifier();

    // if the language_id isn't set then default to English
    if( is_null( $db_reqn->language_id ) )
      $db_reqn->language_id = $language_class_name::get_unique_record( 'code', 'en' )->id;

    // if the current user has a supervisor then make them the owner
    $db_graduate = $graduate_class_name::get_unique_record( 'graduate_user_id', $db_reqn->user_id );
    if( !is_null( $db_graduate ) )
    {
      $db_reqn->user_id = $db_graduate->user_id;
      $db_reqn->graduate_id = $db_graduate->id;
    }
  }
}

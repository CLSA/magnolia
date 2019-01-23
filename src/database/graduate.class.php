<?php
/**
 * graduate.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * graduate: record
 */
class graduate extends \cenozo\database\record
{
  /**
   * Override the parent method
   */
  public function save()
  {
    $reqn_class_name = lib::get_class_name( 'database\reqn' );
    parent::save();

    // reassign any reqns belonging to the graduate
    $reqn_mod = lib::create( 'database\modifier' );
    $reqn_mod->where( 'user_id', '=', $this->graduate_user_id );
    foreach( $reqn_class_name::select_objects( $reqn_mod ) as $db_reqn )
    {
      $db_reqn->user_id = $this->user_id;
      $db_reqn->graduate_id = $this->id;
      $db_reqn->save();
    }
  }

  /**
   * Override the parent method
   */
  public function delete()
  {
    $reqn_class_name = lib::get_class_name( 'database\reqn' );
    
    // reassign any reqns belonging to this graduate
    $reqn_mod = lib::create( 'database\modifier' );
    $reqn_mod->where( 'graduate_id', '=', $this->id );
    foreach( $reqn_class_name::select_objects( $reqn_mod ) as $db_reqn )
    {
      $db_reqn->user_id = $this->graduate_user_id;
      $db_reqn->graduate_id = NULL;
      $db_reqn->save();
    }

    parent::delete();
  }

  /**
   * Convenience method to get the graduate user record
   * @return database\user
   */
  public function get_graduate_user()
  {
    return is_null( $this->graduate_user_id ) ?
      NULL : lib::create( 'database\user', $this->graduate_user_id );
  }
}

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
    $reqn_class_name = lib::get_class_name( 'database\reqn' );

    parent::prepare();

    // clone an existing reqn
    $clone_identifier = $this->get_argument( 'clone', false );
    if( $clone_identifier )
    {
      $db_reqn = $this->get_leaf_record();
      $db_cloned_reqn = $reqn_class_name::get_unique_record( 'identifier', $clone_identifier );

      $db_reqn->reqn_type_id = $db_cloned_reqn->reqn_type_id;
      $db_reqn->user_id = $db_cloned_reqn->user_id;
      $db_reqn->trainee_user_id = $db_cloned_reqn->trainee_user_id;
      $db_reqn->language_id = $db_cloned_reqn->language_id;
      $db_reqn->note = sprintf( 'Cloned from requisition %s', $db_cloned_reqn->identifier );
    }
  }

  protected function finish()
  {
    $reqn_class_name = lib::get_class_name( 'database\reqn' );

    parent::finish();

    // clone an existing reqn_version
    $clone_identifier = $this->get_argument( 'clone', false );
    if( $clone_identifier )
    {
      // delete the empty reqn version which was just created as the cloned one will be version #1
      $db_reqn = $this->get_leaf_record();
      $db_temp_reqn_version = $db_reqn->get_current_reqn_version();

      // create a new version using the clone
      $db_reqn->create_version(
        false, // don't create a new amendment
        $reqn_class_name::get_unique_record( 'identifier', $clone_identifier )->get_current_reqn_version()
      );

      // now remove the first version (an empty form) and re-version the second form to the first (the cloned form)
      $db_temp_reqn_version->delete();
      $db_reqn_version = $db_reqn->get_current_reqn_version();
      $db_reqn_version->version = 1;
      $db_reqn_version->save();
    }
  }
}

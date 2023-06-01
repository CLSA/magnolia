<?php
/**
 * post.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\reqn\packaged_data;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * The base class of all post services.
 */
class post extends \cenozo\service\post
{
  /**
   * Replaces parent method
   */
  public function get_leaf_parent_relationship()
  {
    $relationship_class_name = lib::get_class_name( 'database\relationship' );
    return $relationship_class_name::MANY_TO_MANY;
  }

  /**
   * Replaces parent method
   */
  public function execute()
  {
    $db_reqn = $this->get_parent_record();
    if( !is_null( $db_reqn ) )
    {
      $post_object = $this->get_file_as_object();
      if( is_string( $post_object ) )
      {
        // add a link by filename
        $this->add_symlink( $post_object );
      }
      else if( is_object( $post_object ) )
      {
        if( property_exists( $post_object, 'add' ) )
        {
          // add a list of links by filename
          foreach( $post_object->add as $filename ) $this->add_symlink( $filename );
        }
        if( property_exists( $post_object, 'remove' ) )
        {
          // remove a list of links by filename
          foreach( $post_object->remove as $filename ) $this->remove_symlink( $filename );
        }
      }
      else if( is_array( $post_object ) )
      {
        // doesn't need to be implemented
        throw lib::create( 'exception\runtime',
          'Replacing reqn packaged data list is not implemented, use add/remove instead.',
          __METHOD__
        );
      }

      $this->status->set_code( 201 );
    }
  }

  /**
   * Adds a symlink to the parent reqn for the packaged data by filename
   * @param string $filename The name of the packaged data file (without full path)
   */
  protected function add_symlink( $filename )
  {
    $db_reqn = $this->get_parent_record();
    $target = sprintf( '%s/%s', PACKAGED_DATA_PATH, $filename );
    $link = sprintf( '%s/%s', $db_reqn->get_study_data_path( 'data' ), $filename );
    if( file_exists( $target ) && !file_exists( $link ) ) symlink( $target, $link );
  }

  /**
   * Removes a symlink from the parent reqn for the packaged data by filename
   * @param string $filename The name of the packaged data file (without full path)
   */
  protected function remove_symlink( $filename )
  {
    $db_reqn = $this->get_parent_record();
    $link = sprintf( '%s/%s', $db_reqn->get_study_data_path( 'data' ), $filename );
    if( file_exists( $link ) && is_link( $link ) ) unlink( $link );
  }
}

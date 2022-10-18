<?php
/**
 * post.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\reqn\data_release;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * The base class of all post services.
 */
class post extends \cenozo\service\write
{
  /**
   * Extends parent constructor
   */
  public function __construct( $path, $args, $file )
  {
    parent::__construct( 'POST', $path, $args, $file );
  }

  /**
   * Extends parent method
   */
  protected function execute()
  {
    parent::execute();

    // create a record for every value in the data_version_id array
    $db_reqn = $this->get_parent_record();
    $post_object = $this->get_file_as_object();

    try
    {
      foreach( $post_object->data_version_id as $data_version_id )
      {
        $db_data_release = lib::create( 'database\data_release' );
        $db_data_release->reqn_id = $db_reqn->id;
        $db_data_release->data_version_id = $data_version_id;
        $db_data_release->category = $post_object->category;
        $db_data_release->date = $post_object->date;
        $db_data_release->save();
      }

      $this->status->set_code( 201 );
    }
    catch( \cenozo\exception\database $e )
    {
      $this->status->set_code( $e->is_missing_data() ? 400 : 500 );
      throw $e;
    }
  }
}

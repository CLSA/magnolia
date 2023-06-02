<?php
/**
 * query.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\reqn\packaged_data;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Special reqn for handling the query meta-resource
 */
class query extends \cenozo\service\query
{
  /**
   * Replaces parent method
   */
  public function prepare()
  {
    $this->select = lib::create( 'database\select' );
    $this->modifier = lib::create( 'database\modifier' );
  }

  /**
   * Replaces parent method
   */
  public function setup()
  {
    parent::setup();

    $db_reqn = $this->get_parent_record();

    $this->file_list = [];
    foreach( glob( sprintf( '%s/*', PACKAGED_DATA_PATH ) ) as $filename )
    {
      if( !is_dir( $filename ) )
      {
        $this->file_list[] = basename( $filename );
      }
    }

    $this->selected_file_list = [];
    foreach( glob( sprintf( '%s/*', $db_reqn->get_study_data_path( 'data' ) ) ) as $filename )
    {
      if( is_link( $filename ) && in_array( basename( $filename ), $this->file_list ) )
      {
        $this->selected_file_list[] = basename( $filename );
      }
    }
  }

  /**
   * Replaces parent method
   */
  public function execute()
  {
    $this->headers['Limit'] = $this->modifier->get_limit();
    $this->headers['Offset'] = $this->modifier->get_offset();
    $this->headers['Total'] = $this->get_record_count();
    if( !$this->get_argument( 'count', false ) ) $this->set_data( $this->get_record_list() );
  }

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
  protected function get_record_count()
  {
    return $this->get_argument( 'choosing', false ) ?
      count( $this->file_list ) : count( $this->selected_file_list );
  }

  /**
   * Replaces parent method
   */
  protected function get_record_list()
  {
    $list = [];
    if( $this->get_argument( 'choosing', false ) )
    {
      foreach( $this->file_list as $filename )
      {
        $list[] = [
          'id' => $filename,
          'filename' => $filename,
          'chosen' => in_array( $filename, $this->selected_file_list )
        ];
      }
    }
    else
    {
      foreach( $this->selected_file_list as $filename ) $list[] = ['filename' => $filename];
    }

    return $list;
  }

  /**
   * A cache of all packaged data filenames
   */
  protected $file_list = [];

  /**
   * A cache of all packaged data filenames selected by the reqn
   */
  protected $selected_file_list = [];
}

<?php
/**
 * post.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\reqn\data_option;
use cenozo\lib, cenozo\log, magnolia\util;

class post extends \cenozo\service\post
{
  /**
   * Replace parent method
   */
  protected function execute()
  {
    $cohort_class_name = lib::get_class_name( 'database\cohort' );
    $parent_record = $this->get_parent_record();
    $post_object = $this->get_file_as_object();

    // handle when posting an object
    if( !is_object( $post_object ) ) parent::execute();

    if( !property_exists( $post_object, 'cohort' ) )
      throw lib::create( 'exception\argument', 'cohort', NULL, __METHOD__ );

    $db_cohort = $cohort_class_name::get_unique_record( 'name', $post_object->cohort );
    if( is_null( $db_cohort ) )
      throw lib::create( 'exception\argument', 'cohort', $post_object->cohort, __METHOD__ );

    if( property_exists( $post_object, 'add' ) )
      $parent_record->add_data_option( $post_object->add, $db_cohort );

    if( property_exists( $post_object, 'remove' ) )
      $parent_record->remove_data_option( $post_object->remove, $db_cohort );

    $this->status->set_code( 201 );
  }
}

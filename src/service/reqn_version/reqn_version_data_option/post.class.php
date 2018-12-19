<?php
/**
 * post.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\reqn_version\reqn_version_data_option;
use cenozo\lib, cenozo\log, magnolia\util;

class post extends \cenozo\service\post
{
  /**
   * Replace parent method
   */
  protected function prepare()
  {
    $study_phase_class_name = lib::get_class_name( 'database\study_phase' );

    parent::prepare();

    // convert study_phase_code column into an ID
    $record = $this->get_leaf_record();
    $post_object = $this->get_file_as_object();
    if( is_object( $post_object ) && property_exists( $post_object, 'study_phase_code' ) )
    {
      $db_study_phase = $study_phase_class_name::get_unique_record( 'code', $post_object->study_phase_code );
      if( !is_null( $db_study_phase ) ) $record->study_phase_id = $db_study_phase->id;
    }
  }
}

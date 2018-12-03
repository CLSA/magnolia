<?php
/**
 * reqn_data_option.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * reqn_data_option: record
 */
class reqn_data_option extends \cenozo\database\record
{
  /**
   * Override parent method
   */
  public static function get_record_from_identifier( $identifier )
  {
    $util_class_name = lib::get_class_name( 'util' );
    $study_phase_class_name = lib::get_class_name( 'database\study_phase' ); 

    // convert study_phase_code to study_phase_id
    if( !$util_class_name::string_matches_int( $identifier ) && false === strpos( 'study_phase_code=', $identifier ) )
    {
      $regex = '/study_phase_code=([^;]+)/';
      $matches = array();
      if( preg_match( $regex, $identifier, $matches ) )
      {
        $db_study_phase = $study_phase_class_name::get_unique_record( 'code', $matches[1] );
        if( !is_null( $db_study_phase ) )
          $identifier = preg_replace( $regex, sprintf( 'study_phase_id=%d', $db_study_phase->id ), $identifier );
      }
    }

    return parent::get_record_from_identifier( $identifier );
  }
}

<?php
/**
 * final_report.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * final_report: record
 */
class final_report extends \cenozo\database\record
{
  /**
   * Override parent method
   */
  public static function get_record_from_identifier( $identifier )
  {
    $util_class_name = lib::get_class_name( 'util' );
    $reqn_class_name = lib::get_class_name( 'database\reqn' ); 

    // convert reqn identifier to reqn_id
    if( !$util_class_name::string_matches_int( $identifier ) && false === strpos( 'identifier=', $identifier ) )
    {
      $regex = '/identifier=([0-9]+)/';
      $matches = array();
      if( preg_match( $regex, $identifier, $matches ) )
      {
        $db_reqn = $reqn_class_name::get_unique_record( 'identifier', $matches[1] );
        if( !is_null( $db_reqn ) ) $identifier = preg_replace( $regex, sprintf( 'reqn_id=%d', $db_reqn->id ), $identifier );
      }
    }

    return parent::get_record_from_identifier( $identifier );
  }
}

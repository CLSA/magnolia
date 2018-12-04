<?php
/**
 * data_option.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * data_option: record
 */
class data_option extends \cenozo\database\has_rank
{
  /**
   * Override parent method
   */
  public static function get_record_from_identifier( $identifier )
  {
    $util_class_name = lib::get_class_name( 'util' );
    $data_option_category_class_name = lib::get_class_name( 'database\data_option_category' ); 

    // convert data_option_category_rank to data_option_category_id
    if( !$util_class_name::string_matches_int( $identifier ) && false === strpos( 'data_option_category_rank=', $identifier ) )
    {
      $regex = '/data_option_category_rank=([0-9]+)/';
      $matches = array();
      if( preg_match( $regex, $identifier, $matches ) )
      {
        $db_data_option_category = $data_option_category_class_name::get_unique_record( 'rank', $matches[1] );
        if( !is_null( $db_data_option_category ) )
          $identifier = preg_replace( $regex, sprintf( 'data_option_category_id=%d', $db_data_option_category->id ), $identifier );
      }
    }

    return parent::get_record_from_identifier( $identifier );
  }

  /**
   * The type of record which the record has a rank for.
   * @var string
   * @access protected
   * @static
   */
  protected static $rank_parent = 'data_option_category';
}

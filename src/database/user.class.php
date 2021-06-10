<?php
/**
 * user.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * user: record
 */
class user extends \cenozo\database\user
{
  /**
   * Returns whether a user has signed up for the newsletter (checking applicant.newsletter)
   */
  public function get_newsletter()
  {
    $select = lib::create( 'database\select' );
    $select->from( 'applicant' );
    $select->add_column( 'newsletter' );

    $modifier = lib::create( 'database\modifier' );
    $modifier->where( 'user_id', '=', $this->id );
    return (boolean) static::db()->get_one( sprintf( '%s %s', $select->get_sql(), $modifier->get_sql() ) );
  }

  /**
   * Sets whether a user should be signed up for the newsletter (setting applicant.newsletter)
   * @param boolean $newsletter
   */
  public function set_newsletter( $newsletter )
  {
    return static::db()->execute( sprintf(
      'INSERT INTO applicant( user_id, newsletter ) VALUES ( %s, %s ) '.
      'ON DUPLICATE KEY UPDATE newsletter = VALUES( newsletter )',
      static::db()->format_string( $this->id ),
      static::db()->format_string( $newsletter )
    ) );
  }

  /**
   * Returns this user's applicant record (if it exists)
   * @return database\applicant
   */
  public function get_applicant()
  {
    $applicant_class_name = lib::get_class_name( 'database\applicant' );
    $db_applicant = $applicant_class_name::get_unique_record( 'user_id', $this->id );
    if( is_null( $db_applicant ) )
    {
      $this->assert_applicant();
      $db_applicant = $applicant_class_name::get_unique_record( 'user_id', $this->id );
    }

    return $db_applicant;
  }

  /**
   * Makes sure that the applicant record exists
   */
  public function assert_applicant()
  {
    static::db()->execute( sprintf(
      'INSERT IGNORE INTO applicant SET user_id = %s',
      static::db()->format_string( $this->id )
    ) );
  }
}

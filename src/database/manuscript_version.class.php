<?php
/**
 * manuscript.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * manuscript: record
 */
class manuscript_version extends \cenozo\database\record
{
  /**
   * Override parent method
   */
  public static function get_record_from_identifier( $identifier )
  {
    $util_class_name = lib::get_class_name( 'util' );
    $manuscript_class_name = lib::get_class_name( 'database\manuscript' );

    // convert manuscript id to manuscript_version_id (always using the current version)
    if( !$util_class_name::string_matches_int( $identifier ) && false === strpos( 'manuscript_id=', $identifier ) )
    {
      $regex = '/manuscript_id=(.+)/';
      $matches = array();
      if( preg_match( $regex, $identifier, $matches ) )
      {
        $db_manuscript = lib::create( 'database\manuscript', $matches[1] );
        if( !is_null( $db_manuscript ) )
          $identifier = preg_replace( $regex, $db_manuscript->get_current_manuscript_version()->id, $identifier );
      }
    }

    return parent::get_record_from_identifier( $identifier );
  }

  /**
   * Determines whether there is any difference between this version and the last
   */
  public function has_changed()
  {
    // get the two newest versions
    $version_mod = lib::create( 'database\modifier' );
    $version_mod->where( 'manuscript_id', '=', $this->manuscript_id );
    $version_mod->order( 'version', true );
    $version_mod->limit( 2 );
    $manuscript_version_list = static::select_objects( $version_mod );
    if( 2 != count( $manuscript_version_list ) ) return true;

    $db_last_manuscript_version = $manuscript_version_list[1];

    // check all column values except for id, version, date and timestamps
    $ignore_columns = array( 'id', 'version', 'date', 'update_timestamp', 'create_timestamp' );
    foreach( $this->get_column_names() as $column )
      if( !in_array( $column, $ignore_columns ) && $this->$column != $db_last_manuscript_version->$column )
        return true;

    // if we get here then everything is identical
    return false;
  }

  /**
   * Generates all PDF forms of the manuscript version (overwritting the previous versions)
   */
  public function generate_pdf_form()
  {
    $pdf_form_type_class_name = lib::get_class_name( 'database\pdf_form_type' );

    $db_pdf_form_type = $pdf_form_type_class_name::get_unique_record( 'name', 'Manuscript Submission' );
    $db_pdf_form = $db_pdf_form_type->get_active_pdf_form();
    if( is_null( $db_pdf_form ) )
      throw lib::create( 'exception\runtime',
        'Cannot generate PDF form since there is no active Manuscript Submission PDF form.', __METHOD__ );
    
    $db_manuscript = $this->get_manuscript();
    $db_reqn = $db_manuscript->get_reqn();
    $db_language = $db_reqn->get_language();
    $db_user = $db_reqn->get_user();
    $db_trainee_user = $db_reqn->get_trainee_user();

    $data = array(
      'identifier' => $db_reqn->identifier,
      'version' => $this->version,
      'date' => is_null( $this->date ) ? 'None' : $this->date->format( 'Y-m-d' )
    );

    $data['applicant_name'] = sprintf( '%s %s', $db_user->first_name, $db_user->last_name );
    if( !is_null( $db_manuscript->title ) ) $data['title'] = $db_manuscript->title;
    if( !is_null( $this->authors ) ) $data['authors'] = $this->authors;
    if( !is_null( $this->journal ) ) $data['journal'] = $this->journal;
    if( true === $this->clsa_title ) $data['clsa_title_yes'] = 'Yes';
    if( false === $this->clsa_title ) $data['clsa_title_no'] = 'Yes';
    if( !is_null( $this->clsa_title_justification ) )
      $data['clsa_title_justification'] = $this->clsa_title_justification;
    if( true === $this->clsa_keyword ) $data['clsa_keyword_yes'] = 'Yes';
    if( false === $this->clsa_keyword ) $data['clsa_keyword_no'] = 'Yes';
    if( !is_null( $this->clsa_keyword_justification ) )
      $data['clsa_keyword_justification'] = $this->clsa_keyword_justification;
    if( true === $this->clsa_reference ) $data['clsa_reference_yes'] = 'Yes';
    if( false === $this->clsa_reference ) $data['clsa_reference_no'] = 'Yes';
    if( !is_null( $this->clsa_reference_number ) )
      $data['clsa_reference_number'] = $this->clsa_reference_number;
    if( !is_null( $this->clsa_reference_justification ) )
      $data['clsa_reference_justification'] = $this->clsa_reference_justification;
    if( true === $this->genomics ) $data['genomics_yes'] = 'Yes';
    if( false === $this->genomics ) $data['genomics_no'] = 'Yes';
    if( !is_null( $this->genomics_number ) )
      $data['genomics_number'] = $this->genomics_number;
    if( !is_null( $this->genomics_justification ) )
      $data['genomics_justification'] = $this->genomics_justification;
    if( !is_null( $this->acknowledgment ) ) $data['acknowledgment'] = $this->acknowledgment;
    if( true === $this->dataset_version ) $data['dataset_version_yes'] = 'Yes';
    if( false === $this->dataset_version ) $data['dataset_version_no'] = 'Yes';
    if( true === $this->seroprevalence ) $data['seroprevalence_yes'] = 'Yes';
    if( false === $this->seroprevalence ) $data['seroprevalence_no'] = 'Yes';
    if( true === $this->covid ) $data['covid_yes'] = 'Yes';
    if( false === $this->covid ) $data['covid_no'] = 'Yes';
    if( true === $this->disclaimer ) $data['disclaimer_yes'] = 'Yes';
    if( false === $this->disclaimer ) $data['disclaimer_no'] = 'Yes';
    if( true === $this->statement ) $data['statement_yes'] = 'Yes';
    if( false === $this->statement ) $data['statement_no'] = 'Yes';
    if( !is_null( $this->objectives ) ) $data['objectives'] = $this->objectives;
    if( true === $this->indigenous ) $data['indigenous_yes'] = 'Yes';
    if( false === $this->indigenous ) $data['indigenous_no'] = 'Yes';

    $filename = sprintf( '%s/manuscript_%s.pdf', TEMP_PATH, $this->id );
    $error = $db_pdf_form->fill_and_write_form( $data, $filename );
    if( $error )
    {
      throw lib::create( 'exception\runtime',
        sprintf(
          'Failed to generate PDF form "%s" for requisition %s manuscript "%s"%s',
          $filename,
          $db_reqn->identifier,
          $db_manuscript->title,
          "\n".$error
        ),
        __METHOD__
      );
    }
  }
}
